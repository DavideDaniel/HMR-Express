/*
 * ignore this code below - it's for webpack to know that this
 * code needs to be watched and not to append extra elements
 */
const duplicateNode = document.querySelector('svg');
if (module.hot) {
module.hot.accept();
module.hot.dispose(() => {
  if (duplicateNode) {
    duplicateNode.parentNode.removeChild(duplicateNode);
  }
});
}