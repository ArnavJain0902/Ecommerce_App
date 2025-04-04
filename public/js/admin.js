const deleteProduct = async (btn) => {
  try {
    console.log("click");
    const prodId = btn.parentNode.querySelector("[name=productId]").value;
    console.log(prodId);
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

    const result = await fetch("/admin/product/" + prodId, {
      method: "DELETE",
      headers: {
        "csrf-token": csrf,
      },
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
