<?php
include "CONS.php";
include "DLL.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: cadastro.html");
    exit;
}

$nome     = trim($_POST["nome"]     ?? "");
$email    = trim($_POST["email"]    ?? "");
$senha    = $_POST["senha"]         ?? "";
$cpf      = trim($_POST["cpf"]      ?? "");
$endereco = trim($_POST["endereco"] ?? "");
$bairro   = trim($_POST["bairro"]   ?? "");
$cidade   = trim($_POST["cidade"]   ?? "");
$estado   = strtoupper(trim($_POST["estado"] ?? ""));
$cep      = preg_replace('/\D/', '', $_POST["cep"] ?? "");

if (empty($nome) || empty($email) || empty($senha) || empty($cpf) ||
    empty($endereco) || empty($bairro) || empty($cidade) ||
    empty($estado) || empty($cep)) {
    die("❌ Preencha todos os campos.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("❌ E-mail inválido.");
}

if (strlen($senha) < 4) {
    die("❌ A senha deve ter pelo menos 4 caracteres.");
}

$cpfNumeros = preg_replace('/\D/', '', $cpf);
if (strlen($cpfNumeros) !== 11) {
    die("❌ CPF inválido. Use o formato 000.000.000-00.");
}

if (preg_match('/^(\d)\1{10}$/', $cpfNumeros)) {
    die("❌ CPF inválido.");
}

if (strlen($cep) != 8) {
    die("❌ O CEP deve ter 8 dígitos.");
}

if (strlen($estado) != 2) {
    die("❌ O estado deve ter 2 letras (ex: BA, SP).");
}

$conexao = new mysqli($server, $user, $password, $db);
if ($conexao->connect_error) {
    die("Falha na conexão: " . $conexao->connect_error);
}
$conexao->set_charset("utf8mb4");

$check = $conexao->prepare("SELECT id FROM usuarios WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    $check->close();
    $conexao->close();
    die("❌ Este e-mail já está cadastrado.");
}
$check->close();

$checkCpf = $conexao->prepare("SELECT id FROM usuarios WHERE cpf = ?");
$checkCpf->bind_param("s", $cpf);
$checkCpf->execute();
$checkCpf->store_result();

if ($checkCpf->num_rows > 0) {
    $checkCpf->close();
    $conexao->close();
    die("❌ Este CPF já está cadastrado.");
}
$checkCpf->close();

$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

$stmt = $conexao->prepare(
    "INSERT INTO usuarios
        (nome, email, senha, cpf, endereco, bairro, cidade, estado, cep)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param(
    "sssssssss",
    $nome, $email, $senhaHash, $cpf,
    $endereco, $bairro, $cidade, $estado, $cep
);

if ($stmt->execute()) {
    echo "<!DOCTYPE html><html lang='pt-br'><head><meta charset='UTF-8'>";
    echo "<link rel='stylesheet' href='css/styles.css'>";
    echo "<title>Cadastro realizado</title></head>";
    echo "<body class='login-page'><div class='login-container'>";
    echo "<h1 class='login-title'>✅ Cadastro realizado!</h1>";
    echo "<p class='login-subtitle'>Bem-vindo(a), <strong>" .
         htmlspecialchars($nome) . "</strong>!</p>";
    echo "<p class='login-footer'><a href='login.html'>Ir para o login</a></p>";
    echo "<p class='login-voltar'><a href='index.html'>← Voltar à loja</a></p>";
    echo "</div></body></html>";
} else {
    echo "❌ Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$conexao->close();
?>