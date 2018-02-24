<?php

class AppServer
{
    const TYPE_ROOM = 'room';
    const TYPE_USER = 'user';
    
    protected $debug = true;
    protected $type;
    protected $session;
    
    function __construct($userType = null) {
        $this->type = $userType == AppServer::TYPE_ROOM ? AppServer::TYPE_ROOM : AppServer::TYPE_USER;

        $this->sess();
        
        $this->session = new Sessions();
    }
    
    public function serve ($object, $action = 'list')
    {
        $ip = $this->getIpAddr($_SERVER['REMOTE_ADDR']);
        
        switch ($object) {
            case 'users':
                $users = array_filter($this->session->getSessions(), function ($a) use ($ip) {
                    return $a['public_ip'] == $ip && $a['type'] == 'user';
                });
                $this->output(['users'=>array_values($users)]);
                break;
            default:
                $rooms = array_filter($this->session->getSessions(), function ($a) use ($ip) {
                    return true;//$a['public_ip'] == $ip && $a['type'] == 'room';
                });
                $this->output(['rooms'=>array_values($rooms)]);
        }
        
        $this->output(null);
    }
    
    protected function output ($data) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        

        if ($this->debug) {
            $data['debug'] = [
                'sess' => $_SESSION,
                'server' => $_SERVER
            ];
        }

        if (isset($_GET['callback'])) {
            header('Content-type: application/json');
            die( $_GET['callback'] . '(' . json_encode((array)$data, JSON_PRETTY_PRINT) . ')');
        } else {
            header('Content-type: text/javascript');
            die( json_encode((array)$data, JSON_PRETTY_PRINT));
        }
    }
    
    protected function sess () {
        session_save_path ('sess/');
        ini_set('session.gc_maxlifetime', Sessions::MAX_LIFETIME);
        session_set_cookie_params(Sessions::MAX_LIFETIME);
	session_start();
        
	$_SESSION['id'] = session_id();
	$_SESSION['type'] = $this->type;
        $_SESSION['public_ip'] = $this->getIpAddr($_SERVER['REMOTE_ADDR']);
        
        switch ($this->type) {
            case AppServer::TYPE_ROOM:
                $_SESSION['data'] = [
                    'name' => htmlspecialchars($_POST['name'] ?? $_POST['address'] ?? $_SESSION['public_ip']),
                    'address' => filter_var ($_POST['address'] ?? $_SESSION['public_ip'], FILTER_SANITIZE_URL)
                ];
                break;
            default:
                $_SESSION['data'] = [
                    'name' => htmlspecialchars($_POST['name'] ?? $_POST['address'] ?? $_SESSION['public_ip']),
                    'username' => mb_substr(session_id(), 0, 6)
                ];
        }
    }
    
    protected function getIpAddr($addr)
    {
        return $addr;
        $ipv6 = $addr;
        $ipv4 = hexdec(substr($ipv6, 0, 2)). "." . hexdec(substr($ipv6, 2, 2)). "." . hexdec(substr($ipv6, 5, 2)). "." . hexdec(substr($ipv6, 7, 2));
    }
}

class Sessions
{
    const MAX_LIFETIME = 3600;
    protected $list = [];
    
    function __construct() {
        $path = session_save_path();
        $sessFiles = array_diff(scandir($path), ['.', '..']);
        
        foreach ($sessFiles as $file) {
            $filePath = $path.$file;

            if (is_file($filePath)) {
                $tim = time() - date('U', filemtime($filePath));
                
                if ($tim < Sessions::MAX_LIFETIME) {
                    $data = Sessions::unserialize(file_get_contents($filePath));
                    $this->list[] = $data;
                } else {
                    unset($filePath);
                }
            }
        }
    }
    
    public function getSessions () {
        return $this->list;
    }
    
    public static function unserialize($session_data) {
        $method = ini_get("session.serialize_handler");
        switch ($method) {
            case "php":
                return self::unserialize_php($session_data);
                break;
            case "php_binary":
                return self::unserialize_phpbinary($session_data);
                break;
            default:
                throw new Exception("Unsupported session.serialize_handler: " . $method . ". Supported: php, php_binary");
        }
    }

    private static function unserialize_php($session_data) {
        $return_data = array();
        $offset = 0;
        while ($offset < strlen($session_data)) {
            if (!strstr(substr($session_data, $offset), "|")) {
                throw new Exception("invalid data, remaining: " . substr($session_data, $offset));
            }
            $pos = strpos($session_data, "|", $offset);
            $num = $pos - $offset;
            $varname = substr($session_data, $offset, $num);
            $offset += $num + 1;
            $data = unserialize(substr($session_data, $offset));
            $return_data[$varname] = $data;
            $offset += strlen(serialize($data));
        }
        return $return_data;
    }

    private static function unserialize_phpbinary($session_data) {
        $return_data = array();
        $offset = 0;
        while ($offset < strlen($session_data)) {
            $num = ord($session_data[$offset]);
            $offset += 1;
            $varname = substr($session_data, $offset, $num);
            $offset += $num;
            $data = unserialize(substr($session_data, $offset));
            $return_data[$varname] = $data;
            $offset += strlen(serialize($data));
        }
        return $return_data;
    }
}