const addresses = {
  factory: {
    dev: "0x24c3Ee5e8Ba52957567570D4c3Ed16b85eb3c91b",
    rinkeby: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, // "0xA5BC059cb9F0D659A7e15C324e330f3adF12b095",
  },
};

// TODO: figure out how to pass this via CLI!
export function getFactoryAddress(env = "dev") {
  return addresses.factory[env];
}
