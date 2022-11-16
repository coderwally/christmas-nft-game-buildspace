const CONTRACT_ADDRESS = '0xfF8C6CcFE325163f355d1Cd2815E96E1f01E53B9';

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