export default {
  name: 'err',
  execute(err: Error) {
    console.log(`A database error has occured\n${err}`);
  },
};
