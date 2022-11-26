const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

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
