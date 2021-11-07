import jieba
import wordcloud
import sys
import os

# 读取停用词列表
def get_stopword_list(file):
    with open(file, 'r', encoding='utf-8') as f:    # 
        stopword_list = [word.strip('\n') for word in f.readlines()]
    return stopword_list


# 分词 然后清除停用词语
def clean_stopword(str, stopword_list):
    result = ''
    word_list = jieba.lcut(str)   # 分词后返回一个列表  jieba.cut()   返回的是一个迭代器
    for w in word_list:
        if w not in stopword_list:
            result += w
    return " ".join(jieba.lcut(result))

if __name__ == '__main__':
    dirpath = os.path.dirname(__file__)
    stopword_file = dirpath + '/cn_stopwords.txt'
    process_file = dirpath + f'/record-{sys.argv[1]}.txt'
    stopword_list = get_stopword_list(stopword_file)    # 获得停用词列表
    with open(process_file, 'r', encoding='utf-8') as f:
        text = f.read()
        w = wordcloud.WordCloud(font_path="msyh.ttc",width=600,height=420,background_color="white")
        w.generate(clean_stopword(text,stopword_list))
        image = w.to_file(dirpath + f"/wordcloud-{sys.argv[1]}.png")
