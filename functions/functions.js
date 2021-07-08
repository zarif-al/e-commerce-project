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
  if (data != null) {
    let sum = 0;
    data.forEach((items) => {
      sum += items.quantity * items.price;
    });
    return sum;
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
  })
    .then((response) => response.json())
    .then((data) => {
      return data.message;
    });
}
