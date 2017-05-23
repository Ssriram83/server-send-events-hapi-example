**This is an example of illustrating Server Sent Events using Hapi js.** 
Key things to know about SSE:

 - SSE is one of the ways to push data to a client. Websockets being
   another.
 - But unlike websocket, SSE can only push data to a client browser and cannot receive data. 
 - Websockets are more powerful than SSEs but it might be an overkill to implement websocket for simple use cases.
  Typical Use cases of SSEs:
 - Update RSS feeds to a client
 - Stream Twitter User feeds.
 - Stream Stock ticker information. 
 The main 'gotcha' about SSE:
It can be used to stream text or json data. Binary data is not supported - which should be cool in most of the integration scenarios where json is used for exchange.  
The other thing is, there is a hard limit on number of connections opened per browser. Which is not so cool. A system design should be
 mindful of this limitation. 
In this example: 
[SUsie](https://www.npmjs.com/package/susie) is used as SSE implementation. 
This plugin simplifies the SSE implementation by exposing a reply.event() method in which a stream of data can be written to. 
In the client end - I have used Angular JS. The main thing to note is that client needs to make use of EventSource to get data from the Server. 
  

