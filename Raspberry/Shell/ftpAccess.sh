# PLC access through FTP
i=0
while(i==0);
do
        rm TESTE_1.log
        wget --user=USER --password='USER' ftp://192.168.1.100/usr/Log/TESTE_1.$
        cat TESTE_1.log
        #PLC access each 10 sec
        sleep 10
done