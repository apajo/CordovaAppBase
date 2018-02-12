<?php
chdir('..');
include('AppServer.php');

$server = new AppServer('user');

$server->serve(@$_GET['object'], @$_GET['action']);