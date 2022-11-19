const CONTRACT_ADDRESS = "0xa6F092A3c14C72603952F5e26f0A66f7d04C633c";

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    joyPoints: characterData.joyPoints.toNumber(),
    maxJoyPoints: characterData.maxJoyPoints.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
