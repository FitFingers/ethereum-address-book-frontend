const addresses = {
  factory: {
    dev: "0xF61377Fd98FCc77927c357C45735967f1300A40F", // must be manually updated (for ganache)
    rinkeby: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, // "0xA5BC059cb9F0D659A7e15C324e330f3adF12b095",
  },
};

// TODO: figure out how to pass this via CLI!
export function getFactoryAddress(env = "dev") {
  return addresses.factory[env];
}
