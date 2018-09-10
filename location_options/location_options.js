const prodata = require('GlobalProvinces_extend.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pro : {
            type : String,
            observer(newVal, oldVal) {
                this.setData({
                    pro : newVal
                })
            }
        },
        city : {
            type: String,
            observer(newVal, oldVal) {
                this.setData({
                    city: newVal
                })
            }
        },
        unit : {
            type: String,
            observer(newVal, oldVal) {
                this.setData({
                    unit: newVal
                })
            }
        },
        street : {
            type: String,
            observer(newVal, oldVal) {
                this.setData({
                    street: newVal
                }, () => {
                    this.init();
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 根据选择变换列表事件
        pickerChange(e) {
            let that = this;
            let { column, value } = e.detail;
            // 如果调整省,那么省不动，其余调到1
            if (column === 0) {
                let city_rang = inital(prodata[that.data.pro_rang[value]]);
                let unit_rang = inital(prodata[that.data.pro_rang[value]][city_rang[0]]);
                let street_rang = prodata[that.data.pro_rang[value]][city_rang[0]][unit_rang[0]];
                that.setData({
                    pro_idx : value,
                    city_rang,
                    city_idx : 0,
                    unit_rang,
                    unit_idx : 0,
                    street_rang,
                    street_idx : 0
                });
            // 如果调整市
            } else if (column === 1) {
                // 那么市不动
                let pro = that.data.pro_rang[that.data.pro_idx];
                let city = that.data.city_rang[value];
                let unit_rang = inital(prodata[pro][city]);
                that.setData({
                    city_idx : value,
                    unit_rang,
                    unit_idx : 0,
                    street_rang : prodata[pro][city][unit_rang[0]],
                    street_idx : 0
                });
                // 如果调整区
            } else if (column === 2) {
                // 区不动
                that.setData({
                    unit_idx : value,
                    street_rang : prodata[that.data.pro_rang[that.data.pro_idx]][that.data.city_rang[that.data.city_idx]][that.data.unit_rang[value]],
                    street_idx : 0
                })
            } else if (column === 3) {
                that.setData({
                    street_idx : value
                })
            }
        },
        changeData(e) {
            // 选择完成事件
            let dataArr = e.detail.value;
            // 根据e的value值获得对应的省市区街道字符串数据
            let pro = this.data.pro_rang[dataArr[0]];
            let city = this.data.city_rang[dataArr[1]];
            let unit = this.data.unit_rang[dataArr[2]];
            let street = this.data.street_rang[dataArr[3]];
            this.triggerEvent('myevent', [pro, city, unit, street]);
        },
        init() {
            let that = this;
            // 初始化省列表
            changeState('pro_rang', prodata, 'pro_idx', 'pro', that);
            // 初始化市
            changeState('city_rang', prodata[that.data.pro], 'city_idx', 'city', that);
            // 初始化区
            changeState('unit_rang', prodata[that.data.pro][that.data.city], 'unit_idx', 'unit', that);
            // 初始化街道
            changeState('street_rang', prodata[that.data.pro][that.data.city][that.data.unit], 'street_idx', 'street', that);
        }
    },
    attached() {
        this.init();
    }
})
function inital(data) {
    let arr = [];
    for (let i in data) {
        arr.push(typeof i === 'string' ? i : data[i]);
    }
    return arr;
}
// 根据传值的内容改变
function changeState(rang, tpldata, idxname, name, that) {
    let arr = [];
    if (name !== 'street') {
        for (let i in tpldata) {
            arr.push(i);
        }
    } else {
        arr = tpldata;
    }
    let idx = arr.findIndex((item) => {
        return item === that.data[name];
    });
    that.setData({
        [rang] : arr,
        [idxname] : idx
    })
}