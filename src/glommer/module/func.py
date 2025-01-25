from linebot.models import MessageEvent, TextSendMessage
from linebot.models.flex_message import (
    BubbleContainer, ImageComponent, BoxComponent, TextComponent, IconComponent,
    SeparatorComponent, ButtonComponent
)
from linebot.models.actions import URIAction
from linebot.models import FlexSendMessage

def sendContactInfo(event, line_bot_api):
    return

def sendOpenTime(event, line_bot_api):
    try:
        message = TextSendMessage(
            text='📅 營業時間公告\n我們的營業時間為：\n每天 08:00 - 19:30\n\n過年不休息\n\n歡迎於營業時間內訂購瓦斯或洽詢服務，感謝您！😊',
           )

        line_bot_api.reply_message(event.reply_token,message)
    except:
        line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤！'))

#營業時間
def sendContactInfo(event, line_bot_api):
    try:
        bubble = BubbleContainer(
            direction = 'ltr',
            header = BoxComponent( #標題
                layout = 'vertical',
                contents = [
                    TextComponent(text = '榮冠煤氣行', weight='bold', size='lg'),
                ]
            ),
            hero = ImageComponent( #主圖片
                url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbL8i53qUpPWLXKFK-w7s3XbX0A60UTVJkrw&s',
                size = 'full',
                aspect_ratio = '700:700',
                aspect_mode = 'cover',
            ),
            body = BoxComponent( #主要內容
                layout = 'vertical',
                contents = [
                    # TextComponent(text='評價', size='md'),
                    # BoxComponent(
                    #     layout = 'baseline',
                    #     margin='md',
                    #     contents=[
                    #         IconComponent(size='lg', url = 'https://i.imgur.com/GsWCrIx.png'),
                    #         TextComponent(text='25', size='sm', color='#999999', flex=0),
                    #         IconComponent(size='lg', url = 'https://i.imgur.com/sJPhtB3.png'),
                    #         TextComponent(text='14', size='sm', color='#999999', flex=0),
                    #     ]
                    # ),
                    BoxComponent(
                        layout = 'vertical',
                        margin='lg',
                        contents=[
                            BoxComponent(
                                layout = 'baseline',
                                contents=[
                                    TextComponent(
                                        text='營業地址',
                                        size='sm',
                                        color='#aaaaaa',
                                        flex=2
                                    ),
                                    TextComponent(
                                        text='高雄市三民區建興路19號',
                                        size='sm',
                                        color='#666666',
                                        flex=5
                                    ),
                                ]
                            ),

                            SeparatorComponent(color='#0000FF'),

                            BoxComponent(
                                layout = 'baseline',
                                contents=[
                                    TextComponent(
                                        text='營業時間',
                                        size='sm',
                                        color='#aaaaaa',
                                        flex=2
                                    ),
                                    TextComponent(
                                        text='08:00 - 19:30',
                                        size='sm',
                                        color='#666666',
                                        flex=5
                                    ),
                                ]
                            ),
                            BoxComponent(
                                layout = 'baseline',
                                contents=[
                                    TextComponent(
                                        text='連絡電話',
                                        size='sm',
                                        color='#aaaaaa',
                                        flex=2
                                    ),
                                    TextComponent(
                                        text='073833415',
                                        size='sm',
                                        color='#666666',
                                        flex=5
                                    ),
                                ]
                            ),
                        ]
                    ),
                    BoxComponent(
                        layout = 'horizontal',
                        margin='xxl',
                        contents=[
                            ButtonComponent(
                                style = 'primary',
                                height= 'sm',
                                action = URIAction(
                                    label='電話聯絡',
                                    uri='tel:073833415'
                                ),
                            ),
                            ButtonComponent(
                                style = 'secondary',
                                height= 'sm',
                                action = URIAction(
                                    label='查看網頁',
                                    uri='https://www.facebook.com/prince8851/?locale=zh_TW'
                                ),
                            )
                        ]
                    )
                ],
            ),
            # footer = BoxComponent(
            #     layout = 'vertical',
            #     contents = [
            #         TextComponent(
            #             text='Copyright @ntue',
            #             color = '#888888',
            #             size='sm',
            #             align='center'
            #         ),
            #     ]
            # ),
        )
        message = FlexSendMessage(alt_text="你有新訊息", contents=bubble)
        line_bot_api.reply_message(event.reply_token,message)

    except:
        line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤!'))