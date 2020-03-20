### Tutorial com passos para serem realizados dentro do shell do Raspberry Pi

## **Subir uma interface de rede virtual:**
  - ifconfig interface_name:id network_ip netmask ip_mask up
  - Exemplo:
    - " ifconfig enp3s0:0 192.168.0.1 255.255.255.0 up "
  
## **Ativar/Desativar interface de rede:**
  - **Ativar:** 
    - ifconfig interface_name up
  - **Desativar:**
    - ifconfig interface_name down
## **Importante:**
  - Para que duas interfaces de rede se comuniquem (**Modem 3G** e **switch** do **PLC**) é necessário que os mesmo estejam na mesma faixa de IP.
  - **Exemplo**:
    - A interface de rede do PLC está no IP **198.162.0.100** , então a interface de rede do modem 3G também tem que estar na faixa **192.168.0.X** , onde X tem que ser número entre **1 e 254** e **diferente de 100** .