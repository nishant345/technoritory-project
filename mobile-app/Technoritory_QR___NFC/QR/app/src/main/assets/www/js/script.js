// Code goes here
var keySize = 256;
var ivSize = 128;
var iterations = 100;

function encrypt (msg) {
    
  var salt = CryptoJS.lib.WordArray.random(128/8);
  var pass = "Jai Hind";
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/128,
      iterations: iterations
    });

  var iv = CryptoJS.lib.WordArray.random(128/8);

  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC

  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
  return transitmessage;
}

function decrypt (transitmessage) {
    varpass = "Jai Hind";
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  var encrypted = transitmessage.substring(64);
  
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/128,
      iterations: iterations
    });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  })
  return decrypted;
}
