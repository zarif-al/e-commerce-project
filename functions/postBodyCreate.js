const ipn_url = "https://e-commerce-project-delta.vercel.app/api/sslConnection";
export function postBodyCreate(order) {
  let post_body = {};
  post_body["total_amount"] = order.total;
  post_body["currency"] = "BDT";
  post_body["tran_id"] = order.tran_id;
  post_body["success_url"] = "https://e-commerce-project-delta.vercel.app/";
  post_body["fail_url"] = "https://e-commerce-project-delta.vercel.app/";
  post_body["cancel_url"] = "https://e-commerce-project-delta.vercel.app/";
  post_body["ipn_url"] = ipn_url;
  post_body["emi_option"] = 0;
  post_body["cus_name"] = order.name;
  post_body["cus_email"] = order.email;
  post_body["cus_phone"] = order.phoneNumber;
  post_body["cus_add1"] = order.address;
  post_body["cus_city"] = order.city;
  post_body["cus_country"] = "Bangladesh";
  post_body["shipping_method"] = "NO";
  post_body["multi_card_name"] = "";
  post_body["num_of_item"] = order.itemCount;
  post_body["product_name"] = "ComputerHardware";
  post_body["product_category"] = "Computer Hardware";
  post_body["product_profile"] = "general";
  return post_body;
}
