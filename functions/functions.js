export function itemCount(data) {
  let sum = 0;
  if (data === null) {
    return 0;
  }
  data.forEach((items) => {
    sum += items.quantity;
  });
  return sum;
}

export function cartTotal(data) {
  if (data !== undefined) {
    if (data.message !== "Error" && data.data[0].cart !== undefined) {
      let sum = 0;
      data.data[0].cart.forEach((items) => {
        sum += items.quantity * items.price;
      });
      return sum;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

export async function cartAction(item) {
  return await fetch("/api/cartApi", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).then((res) => {
    return "success";
  });
}
