select optiontable.productID,optiontable.optionattribute,optiontable.value from optiontable LEFT OUTER JOIN products ON (optiontable.productID=products.productid)