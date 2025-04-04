const deleteProduct = async (btn) => {
  try {
    const prodId = btn.parentNode.querySelector("[name=productId]").value;
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
    const productElement = btn.closest("article");

    const result = await fetch("/admin/product/" + prodId, {
      method: "DELETE",
      headers: {
        "csrf-token": csrf,
      },
    });
    productElement.parentNode.removeChild(productElement)
  } catch (err) {
    console.log(err);
  }
};
