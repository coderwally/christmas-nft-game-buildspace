const CONTRACT_ADDRESS = "0x4f1eABEeFBb63d7e8c758Ae6Df0f10D6233555eb";

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
