<?php

include_once('./fn.php');

$file = './filezilla/sitemanager.xml';

$xmlNode = simplexml_load_file($file);
$arrayData = xmlToArray($xmlNode);
$resArr = '';

foreach ($arrayData['FileZilla3']['Servers']['Folder'] as $key => $value) {
    $resArr .= '<h2>' . $value['$'] . '</h2>';
    foreach ($value['Server'] as $k => $v) {
        $resArr .= '<p>';
        $resArr .= '<span><strong>Name</strong> - ' . $v['Name'] . '</span><br>';
        $resArr .= '<span><strong>Host</strong> - ' . $v['Host'] . ':' . $v['Port'] . '</span><br>';
        $resArr .= '<span><strong>User</strong> - ' . $v['User'] . '</span><br>';
        $resArr .= '<span><strong>Pass</strong> - ' . base64_decode($v['Pass']['$']) . '</span><br>';
        $resArr .= '</p>';
    }
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FTP Listener</title>
    <link rel="stylesheet" href="./style.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
</head>

<body>
    <?= $resArr ?>
</body>

</html>
