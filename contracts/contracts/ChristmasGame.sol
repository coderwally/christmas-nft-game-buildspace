// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./libraries/Base64.sol";

import "hardhat/console.sol";

contract ChristmasGame is ERC721 {
    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;
        uint joyPoints;
        uint maxJoyPoints;
        uint attackDamage;
    }
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    CharacterAttributes[] defaultCharacters;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    mapping(address => uint256) public nftHolders;

    struct BigBoss {
        string name;
        string imageURI;
        uint joyPoints;
        uint maxJoyPoints;
        uint attackDamage;
    }

    BigBoss public bigBoss;

    uint randNonce = 0; // this is used to help random number generator

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterJoyPoints,
        uint[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint bossJoyPoints,
        uint bossAttackDamage
    ) ERC721("Christmas Joy Spreaders", "XMAS") {
        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            joyPoints: bossJoyPoints,
            maxJoyPoints: bossJoyPoints,
            attackDamage: bossAttackDamage
        });

        console.log(
            "Done initializing boss %s w/ JP %s, img %s",
            bigBoss.name,
            bigBoss.joyPoints,
            bigBoss.imageURI
        );

        for (uint i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    joyPoints: characterJoyPoints[i],
                    maxJoyPoints: characterJoyPoints[i],
                    attackDamage: characterAttackDmg[i]
                })
            );

            CharacterAttributes memory c = defaultCharacters[i];

            console.log(
                "Done initializing %s w/ JoyPoints %s, img %s",
                c.name,
                c.joyPoints,
                c.imageURI
            );
        }

        _tokenIds.increment(); //Start with ID 1
    }

    function mintCharacterNFT(uint _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        // Map the tokenId => their character attributes
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            joyPoints: defaultCharacters[_characterIndex].joyPoints,
            maxJoyPoints: defaultCharacters[_characterIndex].maxJoyPoints,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );

        nftHolders[msg.sender] = newItemId;

        _tokenIds.increment();
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strJoyPoints = Strings.toString(charAttributes.joyPoints);
        string memory strMaxJoyPoints = Strings.toString(
            charAttributes.maxJoyPoints
        );
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDamage
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Christmas Joy Spreader!", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Joy Points", "value": ',
                strJoyPoints,
                ', "max_value":',
                strMaxJoyPoints,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function randomInt(uint _modulus) internal returns (uint) {
        randNonce++; // increase nonce
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.timestamp, // an alias for 'block.timestamp'
                        msg.sender, // your address
                        randNonce
                    )
                )
            ) % _modulus; // modulo using the _modulus argument
    }

    function attackBoss() public {
        // Get the state of the player's NFT.
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[
            nftTokenIdOfPlayer
        ];

        console.log(
            "\nPlayer w/ character %s about to attack. Has %s JP and %s AD",
            player.name,
            player.joyPoints,
            player.attackDamage
        );
        console.log(
            "Boss %s has %s JP and %s AD",
            bigBoss.name,
            bigBoss.joyPoints,
            bigBoss.attackDamage
        );

        // Make sure the player has more than 0 HP.
        require(
            player.joyPoints > 0,
            "Error: character must have JP to attack boss."
        );

        // Make sure the boss has more than 0 HP.
        require(
            bigBoss.joyPoints > 0,
            "Error: boss must have JP to attack character."
        );

        // Allow player to attack boss.
        if (bigBoss.joyPoints < player.attackDamage) {
            bigBoss.joyPoints = 0;
            console.log("The boss is dead!");
        } else {
            if (randomInt(100) > 25) {
                bigBoss.joyPoints = bigBoss.joyPoints - player.attackDamage;
                console.log(
                    "%s attacked boss %s. New boss JP: %s",
                    player.name,
                    bigBoss.name,
                    bigBoss.joyPoints
                );
            } else {
                console.log("%s missed!\n", player.name);
            }
        }

        // Allow boss to attack player.
        if (player.joyPoints < bigBoss.attackDamage) {
            player.joyPoints = 0;
            console.log("The player is dead!");
        } else {
            if (randomInt(100) > 75) {
                player.joyPoints = player.joyPoints - bigBoss.attackDamage;
                console.log(
                    "Boss %s attacked player %s. New player JP: %s\n",
                    bigBoss.name,
                    player.name,
                    player.joyPoints
                );
            } else {
                console.log("Boss %s missed!\n", bigBoss.name);
            }
        }
    }
}
