<?php

 define('DB_SERVER', 'localhost');
   define('DB_USERNAME', 'shtypi');
   define('DB_PASSWORD', 'mxDxHbCJW');
   define('DB_DATABASE', 'ana');
   $conn = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);

if (mysqli_connect_errno())
{
     echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
else  
{
	//echo "Connected successfully"."<br>";
}


?>