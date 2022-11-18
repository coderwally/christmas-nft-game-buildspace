// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./libraries/Base64.sol";

import "hardhat/console.sol";

//      _  _____   __  _____ ___    _____ _   _ _____  __        _____  ____  _     ____
//     | |/ _ \ \ / / |_   _/ _ \  |_   _| | | | ____| \ \      / / _ \|  _ \| |   |  _ \
//  _  | | | | \ V /    | || | | |   | | | |_| |  _|    \ \ /\ / | | | | |_) | |   | | | |
// | |_| | |_| || |     | || |_| |   | | |  _  | |___    \ V  V /| |_| |  _ <| |___| |_| |
//  \___/ \___/ |_|     |_| \___/    |_| |_| |_|_____|    \_/\_/  \___/|_| \_|_____|____/

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

    address[] public nftHolderAddresses;
    mapping(address => bool) internal holderExists;
    uint256 public nftHolderCount;

    struct BigBoss {
        string name;
        string imageURI;
        uint joyPoints;
        uint maxJoyPoints;
        uint attackDamage;
    }

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(
        address sender,
        uint newBossHp,
        uint newPlayerHp,
        uint playerAttackResult,
        uint bossAttackResult
    );

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

        if (!holderExists[msg.sender]) {
            nftHolderAddresses.push(msg.sender);
            holderExists[msg.sender] = true;
            nftHolderCount += 1;
        }

        _tokenIds.increment();

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
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
                '", "description": "This is an NFT that lets people play in the game Christmas Joy Spreader!", "image": "ipfs://',
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
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % _modulus;
    }

    function attackBoss() public {
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

        uint actionResultPlayer = 0;
        uint actionResultBoss = 0;

        // Allow player to attack boss.
        if (bigBoss.joyPoints < player.attackDamage) {
            bigBoss.joyPoints = 0;
            console.log("The boss is dead!");
            actionResultPlayer = 3;
        } else {
            if (randomInt(100) > 66) {
                // 66% chance of succeeding
                bigBoss.joyPoints = bigBoss.joyPoints - player.attackDamage;
                console.log(
                    "%s attacked boss %s. New boss JP: %s",
                    player.name,
                    bigBoss.name,
                    bigBoss.joyPoints
                );
                actionResultPlayer = 1;
            } else {
                console.log("%s missed!\n", player.name);
                actionResultPlayer = 2;
            }
        }

        // Allow boss to attack player.
        if (player.joyPoints < bigBoss.attackDamage) {
            player.joyPoints = 0;
            console.log("The player is dead!");
            actionResultBoss = 3;
        } else {
            if (randomInt(100) > 50) {
                //50% chance of succeeding
                player.joyPoints = player.joyPoints - bigBoss.attackDamage;
                console.log(
                    "Boss %s attacked player %s. New player JP: %s\n",
                    bigBoss.name,
                    player.name,
                    player.joyPoints
                );
                actionResultBoss = 1;
            } else {
                console.log("Boss %s missed!\n", bigBoss.name);
                actionResultBoss = 2;
            }
        }

        emit AttackComplete(
            msg.sender,
            bigBoss.joyPoints,
            player.joyPoints,
            actionResultPlayer,
            actionResultBoss
        );
    }

    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        // Get the tokenId of the user's character NFT
        uint256 userNftTokenId = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return their character.
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        // else, return an empty character.
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }

    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }

    function getAllPlayers()
        public
        view
        returns (address[] memory, CharacterAttributes[] memory)
    {
        CharacterAttributes[] memory allAttributes = new CharacterAttributes[](
            nftHolderAddresses.length
        );

        for (
            uint holderIndex = 0;
            holderIndex < nftHolderAddresses.length;
            holderIndex++
        ) {
            address currentHolderAddy = nftHolderAddresses[holderIndex];
            uint tokenId = nftHolders[currentHolderAddy];
            CharacterAttributes memory atts = nftHolderAttributes[tokenId];

            allAttributes[holderIndex] = atts;
        }

        return (nftHolderAddresses, allAttributes);
    }
}
