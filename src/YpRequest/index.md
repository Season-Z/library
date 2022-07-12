---
title: YpRequest - 请求
nav:
  title: 中台组件
  path: /components
---

### YpRequest 使用

```javascript
// 引入使用
import { YpRequest } from 'yp-frontend-library';
// await YpRequest('auth.subject.listSubjectMenu', dataVal); //第一个参数网关地址，第二个是接口所需参数
const listSubjectMenu = async () => {
  try {
    const dataVal = {
      appCode: props.menuCode,
      subjectId: getLocalData('subjectId'),
    };
    const res: IC = await YpRequest('auth.subject.listSubjectMenu', dataVal);
    if (res.success) {
      // .....
    } else {
    }
  } catch (error) {
    console.log(' ...error', error);
    return null;
  }
};
```

### 接口入参和数据返回格式规范

```javascript
//1.接口返回格式规范：
//如果是正常的成功请求，接口返回完整格式必须是这样

{

success:true,//网关层数据返回

traceId:'xxxxxxx',

result:{

     success:true,

     result:{      //业务接口的正确数据，必须放再这个result里面

            key1:'xxxx',

            key2:'xxxxx;

            ......

    }

}

}

//如果是正常的分页列表接口，接口返回字段格式需要如下（入参必须是{size:20,page:1}）size是每页条数，page是第几页：

{

success:true,//网关层数据返回

traceId:'xxxxxxx',

result:{

     success:true,

     result:{      //分页

          list:[{},{},{}],//必须有

          page:1,//必须有

          size:20,//必须有

         isEnd：false,//建议有

         total: 50

         ......

    }

}

}

//如果接口发生错误，接口返回的格式需要如下：

   // 1.网关层错误:

{

   success: false

    error: {    //错误信息必须包再这个error字段里面

       code: -32002,

       message: "Token expired"

    },

  traceId: "60ff7ca07e76c022"

}

//2.业务层错误:

{

   success: true,

   result:

       {

          success:false,

           error: {    //错误信息必须包再这个error字段里面

            code: -10086,

            message: "导出数据不能为空"

           },

      },

 traceId: "60ff7ca07e76c022"

}
```
