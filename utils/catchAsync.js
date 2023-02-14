module.exports = (func) => {
  // takes async method and returns it wrapped with a try/catch
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
