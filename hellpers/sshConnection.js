import node_ssh from "node-ssh"

const ssh = new node_ssh()
const privateKeyDirctory = './keys/'

const sshConnection = (ip,username,privateKey)=> {
    return new Promise((resolve,reject) => {
        console.log(privateKeyDirctory + privateKey)
        // connection to server
         ssh.connect({
            host: ip,
            username: username,
            privateKey: privateKeyDirctory + privateKey
          }).then(res => resolve(res))
          .catch(err => reject(err))
    })
}
// 

export default sshConnection