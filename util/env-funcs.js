const addresses = {
  factory: {
    dev: "0xb7c020A32FDc95D9FA619D0c5Fa207Ae9d80b7c1", // must be manually updated (for ganache)
    rinkeby: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, // "0xA5BC059cb9F0D659A7e15C324e330f3adF12b095",
  },
};

// TODO: figure out how to pass this via CLI!
export function getFactoryAddress(env = "dev") {
  return addresses.factory[env];
}
