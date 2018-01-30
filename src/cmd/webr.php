<?php
error_reporting(E_ERROR);

$json = file_get_contents('resources.json');
$data = (array)json_decode($json, true);

$to = "./www/vendor/";
$from = "./node_modules/";
$srcTo = "./www/";
$srcFrom = "./src/";
$srcNames = ['src', 'core', 'custom'];

$types = [
    "js" => function ($name, $files) {
       $target = array_pop(array_unique($files));
       
        if (!is_dir(dirname($target))) {
            mkdir(dirname($target), 0755, true);
        }
        
        file_put_contents($target, '');

        foreach ($files as $a => $to) {
            if (is_file($a)) {
                echo("cp $a... \n");
                $data = file_get_contents($a);
                file_put_contents($target, $data, FILE_APPEND);
            } else {
                echo("ERROR: FILE NOT FOUND: ".$a);
            }
        };
    },
    "css" => function ($name, $files) {
       $target = array_pop(array_unique($files));
       
        if (!is_dir(dirname($target))) {
            mkdir(dirname($target), 0755, true);
        }
        
        file_put_contents($target, '');

        foreach ($files as $a => $to) {
            if (is_file($a)) {
                echo("cp $a... \n");
                $data = file_get_contents($a);
                file_put_contents($target, $data, FILE_APPEND);
            } else {
                echo("ERROR: FILE NOT FOUND: ".$a);
            }
        };
    }
];

foreach ($types as $type => $callback) {
    foreach ($data as $name => $files) {
        if ($files[$type]) {
            echo("$name ($type)\n");
            echo("-------------------------\n");
            $collection = collectFiles($name, $files[$type]);
            
            if ($collection) {
                $types['js']($name, $collection);
            }
        }
    }
}

function collectFiles ($name, $data) {
    $result = [];
    
    array_map(function ($a) use (&$result, $name) {
        $path = getPaths($name, $a);

        $files = glob($path['from']);

        foreach ($files as $file) {
            if (!array_key_exists($file, $result)) {
                $result[$file] = $path['to'];
            }
        }
    }, $data);

    return $result;
};

function getPaths ($name, $a) {
    global  $from, $to, $srcNames, $srcTo, $srcFrom;
    
    $fileInfo = pathinfo($a);

    if (array_search($name, $srcNames) !== false) {
        return [
            "to" => $srcTo .$name.'.'.$fileInfo['extension'],
            "from" => $srcFrom .$a
        ];
    } else {
        return [
            "to" =>  $to.$a,
            "from" => $from.$a
        ];
    }
}