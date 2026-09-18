<?php
function teste_login($sessao) {
    if ($sessao != "ok") {
        header("Location: login.html?erro=1");
        exit;
    }
}
function banco($server, $user, $password, $db, $consulta)
{
    $conexao = new mysqli($server, $user, $password, $db);

    if ($conexao->connect_error) {
        die("Falha na conexão: " . $conexao->connect_error);
    }

    $conexao->set_charset("utf8mb4");

    $resultado = $conexao->query($consulta);

    if (!$resultado) {
        die("Erro na consulta: " . $conexao->error);
    }
    $dados = [];
    if ($resultado instanceof mysqli_result) {
        while ($linha = $resultado->fetch_assoc()) {
            $dados[] = $linha;
        }
    } else {
        $dados = $resultado;
    }

    $conexao->close();
    return $dados;
}
?>