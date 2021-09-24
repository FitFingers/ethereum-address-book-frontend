const dev = "0xF61377Fd98FCc77927c357C45735967f1300A40F"; // must be manually updated (for ganache)
const rinkeby = process.env.NEXT_PUBLIC_RINKEBY_CONTRACT_ADDRESS; // "0xA5BC059cb9F0D659A7e15C324e330f3adF12b095"
const mainnet = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// TODO: figure out how to pass this via CLI!
export function getFactoryAddress() {
  return mainnet || rinkeby || dev;
}
