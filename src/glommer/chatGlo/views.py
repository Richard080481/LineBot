from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt

from linebot import LineBotApi, WebhookParser
from linebot.exceptions import InvalidSignatureError, LineBotApiError
from linebot.models import MessageEvent, TextMessage
from module import func

line_bot_api = LineBotApi(settings.LINE_CHANNEL_ACCESS_TOKEN)
parser = WebhookParser(settings.LINE_CHANNEL_SECRET)

@csrf_exempt
def callback(request):
    if request.method == 'POST':
        signature = request.META['HTTP_X_LINE_SIGNATURE']
        body = request.body.decode('utf-8')
        try:
            events = parser.parse(body, signature)
        except InvalidSignatureError:
            return HttpResponseForbidden()
        except LineBotApiError:
            return HttpResponseBadRequest()

        for event in events:
            if isinstance(event, MessageEvent):
                if isinstance(event.message, TextMessage):
                    mtext = event.message.text
                    if mtext == '#營業時間':
                        func.sendOpenTime(event, line_bot_api)

                    elif mtext == '#聯絡方式':
                        func.sendContactInfo(event, line_bot_api)

                    elif mtext == '#粉絲專頁':
                        func.sendStick(event)

                    elif mtext == '#多項傳送':
                        func.sendMulti(event)

                    elif mtext == '#傳送位置':
                        func.sendPosition(event)

        return HttpResponse()

    else:
        return HttpResponseBadRequest()