
import random
import time
from azure.iot.device import IoTHubDeviceClient, Message

# The device connection string to authenticate the device with your IoT hub.
# Using the Azure CLI (shell):
#az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id {MyNodeDevice} --output table
CONNECTION_STRING = 'HostName=HubOR.azure-devices.net;DeviceId=rasp_or;SharedAccessKey=a+8VNhUqp5Jrqq1TVpm5cGre+0VHaJuntS1us/qevok='

# Define the JSON message to send to IoT Hub.

# MSG_TXT = '{{"date": {date},"hour": {hour},"variable": {variable},"variable2": {variable2}, "variable3": {variable3},"variable4": {variable4},"variable5": {variable5},"variable6": {variable6},"variable7": {variable7},"variable8": {variable8},"variable9": {variable9},"variable10": {variable10}}}'
MSG_TXT = '{{date: {date},hour: {hour},variable: {variable},variable2: {variable2}, variable3: {variable3},variable4: {variable4},variable5: {variable5},variable6: {variable6},variable7: {variable7},variable8: {variable8},variable9: {variable9},variable10: {variable10},variable11: {variable11}}}'

def iothub_client_init():
    # Create an IoT Hub client
    client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)
    return client

def iothub_client_telemetry_sample_run():

    try:
        client = iothub_client_init()
        print ( "IoT Hub device sending periodic messages, press Ctrl-C to exit" )
      

        while True:
            #PLC's path to access the logfile
            arq = open('/usr/Log/TESTE_1', 'r')
            texto = arq.readline()
            linha2 = arq.readline()
            
            value=linha2.split(';')
            print(value)
            
            msg_txt_formatted = MSG_TXT.format(date=value[0],hour=value[1],variable=value[2],variable2=value[3],variable3=value[4],variable4=value[5],variable5=value[6],variable6=value[7], variable7=value[8], variable8=value[9], variable9=value[10], variable10=value[11], variable11=value[12])
            message = Message(msg_txt_formatted)

            print( "Sending message: {}".format(message) )
            client.send_message(message)
            print ( "Message successfully sent" )
            #Time sleep 60seconds - Project decided to grab data each 1 min (60 sec). Change here if want pick more or less data
            time.sleep(60)

    except KeyboardInterrupt:
        print ( "IoTHubClient sample stopped" )

if __name__ == '__main__':
    print ( "IoT Hub Quickstart #1 - Simulated device" )
    print ( "Press Ctrl-C to exit" )
    iothub_client_telemetry_sample_run()
