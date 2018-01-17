<?php
require ("dbconfig.php");

if (isset($_POST["credentials"]))
{
	$credentials = json_decode($_POST["credentials"], true);
	$GUID = uniqid();

	

	$username = $credentials["username"];
	$password = $credentials["password"];
	//testojme ekzistencen e username
	$query="
		SELECT ID FROM `logininfo`
		WHERE `Username`=\"$username\"
		";
		$vlera = mysqli_query($conn, $query);
		// nese ekziston 
	if (($vlera->num_rows) != 0)
	{	
		 $row = mysqli_fetch_assoc(mysqli_query($conn, $query));
		echo $row["ID"];
}
	 else
	 {
	
	
	$query = "
		INSERT INTO logininfo 
		(Username, Password, GUID) 
		VALUES (\"$username\", \"$password\",\"$GUID\")
		";

	

	if (!mysqli_query($conn, $query))
	{
		echo mysqli_error($conn);
	}
	else

	{
	// marrim ID nga db e logininfo

	$query = "
	SELECT `ID`
	FROM `logininfo` 
	WHERE Username= \"$username\"  
	AND Password=\"$password\"
	
		";

	

	if (!mysqli_query($conn, $query))
	{
		echo mysqli_error($conn);
	}

	
	$row_1 = mysqli_fetch_assoc(mysqli_query($conn, $query));
	echo $row_1["ID"];
}
	 }
}
else
	
if (isset($_POST["points"]))
{
	echo " FALEMINDERIT PER LOGIN-IN";
	$points = json_decode($_POST["points"], true);
	//merret adresa IP
	function get_client_ip_env()
	{
		$ipaddress = '';
		if (getenv('HTTP_CLIENT_IP')) $ipaddress = getenv('HTTP_CLIENT_IP');
		else
		if (getenv('HTTP_X_FORWARDED_FOR')) $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
		else
		if (getenv('HTTP_X_FORWARDED')) $ipaddress = getenv('HTTP_X_FORWARDED');
		else
		if (getenv('HTTP_FORWARDED_FOR')) $ipaddress = getenv('HTTP_FORWARDED_FOR');
		else
		if (getenv('HTTP_FORWARDED')) $ipaddress = getenv('HTTP_FORWARDED');
		else
		if (getenv('REMOTE_ADDR')) $ipaddress = getenv('REMOTE_ADDR');
		else $ipaddress = 'UNKNOWN';

		

		return $ipaddress;
	}

	$points["IP"] = get_client_ip_env();
//print_r($points);
	
//Marrim Id e perdoruesit per ta perdorur me vete .
	$Id = $points["ID"];
	unset($points["ID"]);
	
	//print_r($points);
	
	$tempvar=NULL;
	$hash=NULL;
		
	foreach($points as $key => $value)
	{
		//formatim ne string
		if($value!=NULL)
		{
		
			$value=(string)$value;
			$tempvar.=$value;
	
		}
		
	
	}
		//hashim vlere
		$hash=hash("md5",$tempvar,false);
		
			$query="
				INSERT INTO `fingerprint_raw`
				(`ID_user`, `RawInfo`, `Hash`)
				VALUES (\"$Id\",\"$tempvar\",\"$hash\")
					";
				mysqli_query($conn, $query);
	

	
	foreach($points as $key => $value)
	{
	if ($value != "null")
		{
	//Query per te pare nese ekziston nje vlere tashme ne tabele, per te mos e duplikuar
	$query = "
		SELECT fingerprint_values.Value,fingerprint_values.ID,
		fingerprint_values.fingerprint_names_id
		FROM fingerprint_values
		LEFT JOIN fingerprint_names
		ON fingerprint_values.fingerprint_names_id= fingerprint_names.ID
		WHERE fingerprint_names.label= \"$key\"
		AND fingerprint_values.Value= \"$value\"
		AND fingerprint_names_id=(SELECT ID 
		FROM fingerprint_names
		WHERE label=\"$key\" )";

			$vlera = mysqli_query($conn, $query);

			
//Nqs nuk e ekziston Update fp_values dhe e shtojme tek tabela e usersave.
			if (($vlera->num_rows) == 0)
			{
				$query = "INSERT INTO fingerprint_values 
						(Value, fingerprint_names_id) 
						VALUES (\"$value\",
						(SELECT ID FROM fingerprint_names 
						WHERE label= \"$key\"))";
				mysqli_query($conn, $query);
				
				$query = "INSERT INTO user_value 
				(id_USER, id_value)
				VALUES(\"$Id\", 
				(SELECT ID FROM fingerprint_values 
				WHERE Value=\"$value\"  
				AND fingerprint_names_id=(SELECT ID 
				FROM fingerprint_names WHERE label=\"$key\" )))";
				mysqli_query($conn, $query);
			}
			else
			{
				$query = "SELECT ID FROM fingerprint_values
				WHERE Value=\"$value\" 
				AND fingerprint_names_id =(SELECT ID 
				FROM fingerprint_names WHERE label=\"$key\" )";
				
				$result = mysqli_query($conn, $query);
				$row = mysqli_fetch_row($result);
				$query = "INSERT INTO `user_value`
				(`id_USER`, `id_value`)
				VALUES (\"$Id\",(SELECT ID
				FROM fingerprint_values WHERE Value=\"$value\" AND ID=\"$row[0]\"))";
				
				mysqli_query($conn, $query);
			}
		}
	
	}
	
	
}

else
	if (isset($_POST["check"]))
	{
		$check = json_decode($_POST["check"], true);
		$canvas=$check["Canvas"];
		
		
	
	$query = "SELECT `Value`,`ID` 
	FROM `fingerprint_values` 
	WHERE `fingerprint_names_id`=3";
	$result = mysqli_query($conn, $query);
	$array=array();
	
	while($row = mysqli_fetch_assoc($result))
	{ 
		//fusim te dhenen ne array
		$array[]=$row;
			
	}
	
	$id=NULL;
	foreach($array as $key=>$value)
	{
    if ($value["Value"]==$canvas)
	{
		$id=$value["ID"];
	}
    }
	$query = "SELECT `id_USER` 
	FROM `user_value` 
	WHERE `id_value`=\"$id\""
	;
	$result = mysqli_query($conn, $query);
	$id_user=NULL;
	while($row = mysqli_fetch_assoc($result))
	{
		$id_user=$row["id_USER"];
	}
	$query = "SELECT `Username` 
	FROM `logininfo` 
	WHERE `ID`=\"$id_user\""
	;
	$result = mysqli_query($conn, $query);
	
	$result = mysqli_fetch_assoc(mysqli_query($conn, $query));
	echo "Pershendetje z/znj "."  ".$result["Username"];
	
	}
	
?>