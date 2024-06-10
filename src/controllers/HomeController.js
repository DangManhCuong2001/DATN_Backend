let getHomepage = async (req, res) => {
  return res.render("homepage.ejs");
};

module.exports = {
  getHomepage: getHomepage,
};
