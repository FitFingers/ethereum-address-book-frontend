const addresses = {
  factory: {
    dev: "0xd20Aa116d60e257cd44Eb53124733Bd3e004fe9A", // must be manually updated (for ganache)
    rinkeby: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, // "0xA5BC059cb9F0D659A7e15C324e330f3adF12b095",
  },
};

// TODO: figure out how to pass this via CLI!
export function getFactoryAddress(env = "dev") {
  return addresses.factory[env];
}
