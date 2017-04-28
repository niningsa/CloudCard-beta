开发需要注意的事项:

如何添加安装的平台：
 ionic platform add android
 如何打包安卓的apk：
 ionic build android

调用手机摄像头需要安装的插件：
cordova plugin add https://github.com/wildabeast/BarcodeScanner.git

集成极光推送需要安装的插件：
首先注册一个极光账号把自己的应用放进去获取一个registrationID
cordova plugin add jpush-phonegap-plugin --variable API_KEY= registrationID

需要安装调用手机相册的插件:
cordova plugin add https://github.com/wymsee/cordova-imagePicker.git

商家图片上传需要安装两个插件：
cordova plugin add cordova-plugin-file-transfer


未完成的内容:
结算模块
