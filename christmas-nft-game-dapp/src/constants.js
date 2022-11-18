const CONTRACT_ADDRESS = "0x0b7488006Fd86857A2bf91a5A45d921a568279D4";

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
