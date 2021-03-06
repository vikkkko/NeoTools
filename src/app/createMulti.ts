
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="../../dist/neo-sdk/neo-ts.d.ts"/>
// import {key, TranHelper, NeoRpc} from "./lib";

namespace App{
    export class CreateMulti {
        key: key;
        start(): void {
            const div = document.createElement("div");
            div.style.left = "50px";
            div.style.right = "50px";
            div.style.top = "50px";
            div.style.bottom = "50px";
            div.style.position = "absolute";
            div.style.overflow = "auto";
            document.body.appendChild(div);
    
            let label = document.createElement("label");
            div.appendChild(label);
            label.textContent = "填入公钥";
            const input_pubKey = document.createElement("input");
            div.appendChild(input_pubKey);
            input_pubKey.style.width = "500px";
            input_pubKey.style.position = "absoulte";
            input_pubKey.multiple = true;
            input_pubKey.value = "";
            const btn_addPubKey = document.createElement("button");
            div.appendChild(btn_addPubKey);
            btn_addPubKey.textContent = "增加公钥";
            div.appendChild(document.createElement("br"));
    
            const text_addrs = document.createElement("textarea");
            div.appendChild(text_addrs);
            text_addrs.style.width = "1000px";
            text_addrs.style.height = "100px";
            text_addrs.textContent = "";
            div.appendChild(document.createElement("br"));
    
            label = document.createElement("label");
            div.appendChild(label);
            label.textContent = "最小签名数";
            const input_minSign = document.createElement("input");
            div.appendChild(input_minSign);
            input_minSign.style.width = "500px";
            input_minSign.style.position = "absoulte";
            input_minSign.multiple = true;
            input_minSign.value = "";
            div.appendChild(document.createElement("br"));
    
            const btn_ok = document.createElement("button");
            div.appendChild(btn_ok);
            btn_ok.textContent = "生成多签账户";
            // div.appendChild(document.createElement("hr"));
    
            const text_multi = document.createElement("textarea");
            div.appendChild(text_multi);
            text_multi.style.width = "1000px";
            text_multi.style.height = "100px";
            text_multi.textContent = "";
            div.appendChild(document.createElement("br"));
    
        
            btn_addPubKey.onclick = () => {
                try{
                    const pubKey: string = input_pubKey.value;
                    const bytes_pubKey: Uint8Array = pubKey.hexToBytes();
                    if (bytes_pubKey.length != 33){
                        return;
                    }
                    if (!this.key) {
                        this.key = new key();
                    }
                    this.key.AddPubkey(bytes_pubKey);
                    //更新text_addrs
                    text_addrs.textContent = "";
                    for (let i = 0; i < this.key.MKey_Pubkeys.length; i++) {
                        const pubkey = this.key.MKey_Pubkeys[i];
                        const pubkeystr = pubkey.toHexString();
                        const address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                        text_addrs.textContent = text_addrs.textContent + address + "[" + pubkeystr + "]"+ "\r\n";
                    }
                }
                catch(e){
                    text_addrs.textContent = e;
                }
            }
    
            btn_ok.onclick = () => {
                try{
                    this.key.MKey_NeedCount =Number.parseInt(input_minSign.value);
                    text_multi.textContent = this.key.ToString();
                }catch(e){
                    text_multi.textContent = e;
                }
    
            }
                
        }
    }
    
    window.onload = () =>
    {
        const cm = new CreateMulti();
        cm.start();
    };
}



