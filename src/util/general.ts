export const errorOut = (msg: string) => {
  console.error(msg);
  throw new Error("Startup failed");
};
