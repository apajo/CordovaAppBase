<?php
chdir('..');
include('AppServer.php');

$server = new AppServer('room');

$server->serve(@$_GET['object'], @$_GET['action']);
