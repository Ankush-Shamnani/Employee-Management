const generateRandomPassword = async () => {
  const { default: cryptoRandomString } = await import('crypto-random-string');
  return cryptoRandomString({ length: 8, type: "base64" });
};

module.exports = generateRandomPassword;

