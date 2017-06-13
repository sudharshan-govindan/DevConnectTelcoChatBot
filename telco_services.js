/*eslint-env browser, node*/
var telco_services = {

		_person :[
		{
			  ID: "VFPR1",
			  name: "Ajay",
			  gender:"Male",
			  email:"AJAY@telco.COM",
			  address:"VODAFONE INDIA LTD,COMMERCE ZONE BLDG NO 2,4TH FLOOR S NO 144 NR YERWADA JAIL,PUNE",
			  city:"Pune",
			  circlecode:"mah",
			  device:"Lenovo",
			  plan_type: "Postpaid",
			  dueamt:"56.11",
			  recharge_amt:"",
			  recharge_date:"",
			  number:"1234567890",
			  last_payment_date:"30-11-2016",
			  last_payment_amt:"200",
			  payment_due_date:"19-Feb-17",
			  dob:"23-Feb-75",
			  planname:"Vodafone_Emp_Voice_Plan_2012",
			  pincode:"411006",  free_mins:"CUG free",
			  free_data:"2 GB (3G)",
			  roaming:"Free╩Incoming and Outgoing╩at Standard rates",
			  monthly_sms:"NA",
			  promo_data_pack:"NA",
			  data_used_mb:"2507.95",
			  sms_used:"55",
			  bill_cycle:"11-10",
			  billed_amt:"56.11",  last_payment_mode:"Cash",
			  balance:"0",  alt_number:"4444",  credit_limit:"15000",  pin:"0",  puk:"28705786",  outgoing_bar:"No",
			  conn_status:"Active",
			  bill_mode:"Ebill",
			  vas_active:"CT",
			  intl_roam:"Inactive",
			  dnd:"Active",
			  dnd_category:"Full",
			  activated_packs:"",
			  pack_name:"",
			  pack_validity:"",
			  pack_type:"",
			  pack_benefit:"",
			  plan_change_date:"06-Nov-12",
			  prev_plan:"NA",
			  device_model:"S850",
			  my_account:"Yes",
			  vas_content_downloaded:"NA",
			  nw_strength:"3G",
			  roamer:"IN",
			  circle_type:"4G circle",
			  cust_segment:"IG OCP (Official Cellphone)",
			  open_req_status:"NA",
			  red_family:"NA",
			  stmtdate : "",
			  last_statement_balance : "", stmt_local_mins : "350", stmt_std_mins : "150", stmt_std_sms: "105", stmt_local_sms: "105", stmt_data: "783 MB", stmt_roam_mins : "33", stmt_roam_sms : "2"
			},
			{
			  ID: "VFPR12",
			  name: "Jasjeet",
			  gender:"Male",
			  email:"JASSI@TELCO.COM",
			  address:"EMPLOYEE DEMO CARD VODAFONE CELLULAR LTD THE METROPOLITAN F.P NO 27 S.NO 21 WAKDEWADI SHIVAJINAGAR",
			  city:"Pune",
			  circlecode:"mah",
			  device:"OnePlus",
			  plan_type:"Postpaid",
			  dueamt:"0",
			  recharge_amt:"",
			  recharge_date:"",
			  number:"2222",
			  last_payment_date:"18-Feb-17",
			  last_payment_amt:"1417.96",
			  payment_due_date:"19-Feb-17",
			  dob:"22-Sep-75",
			  planname:"Red_Employee_Voice",
			  pincode:"411005",
			  free_mins:"Unltd Local V2V + 4000 Local/STD Min",
			  free_data:"3 GB",
			  roaming:"Free╩Incoming and Outgoing╩at Standard rates",
			  monthly_sms:"2000 SMS (Local+STD)",
			  promo_data_pack:"1GB Red Fml Addon Pack @ Rs250_RC, RED Family 1 GB Monthly Pack @Rs 250",
			  data_used_mb:"5238.17",
			  sms_used:"53",
			  bill_cycle:"11-10",
			  billed_amt:"1417.96",
			  last_payment_mode:"DD",
			  balance:"0",
			  alt_number:"3333",
			  credit_limit:"25000",
			  pin:"0",
			  puk:"84719643",
			  outgoing_bar:"No",
			  conn_status:"Active",
			  bill_mode:"Ebill",
			  vas_active:"CT",
			  intl_roam:"Inactive",
			  dnd:"Active",
			  dnd_category:"Full",
			  activated_packs:"",
			  pack_name:"",
			  pack_validity:"",
			  pack_type:"",
			  pack_benefit:"",
			  plan_change_date:"01-Feb-16",
			  prev_plan:"Voda_Voice_Plan",
			  device_model:"OneA2003",
			  my_account:"Yes",
			  vas_content_downloaded:"NA",
			  nw_strength:"4G",
			  roamer:"IN",
			  circle_type:"4G circle",
			  cust_segment:"IG OCP (Official Cellphone)",
			  open_req_status:"NA",
			  red_family:"3444363663",
			  stmtdate : "",
			  last_statement_balance : "", stmt_local_mins : "350", stmt_std_mins : "150", stmt_std_sms: "105", stmt_local_sms: "105", stmt_data: "783 MB", stmt_roam_mins : "33", stmt_roam_sms : "2"
			}
	],
	getPerson : function(phone, callback) {
		for (var i=0 ; i < this._person.length; i++)
		{
			if (this._person[i].number === phone)
			{
			callback(null, this._person[i]);
			return;
			}

		}
		callback(null,null);
		}
};
module.exports = telco_services;
