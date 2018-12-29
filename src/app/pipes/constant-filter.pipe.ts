import { Pipe, PipeTransform, NgModule } from '@angular/core';


@Pipe({
  name: 'constantFilter'
})
export class ConstantFilterPipe implements PipeTransform {

  transform(items: any[], FilterValue: any): any {

    if (typeof FilterValue == 'undefined') {      
      return "N/A";
    } else {      
      if ((FilterValue > -1) && ((typeof FilterValue == 'number') || (typeof FilterValue == 'string'))) {
        let filterObject: any = items.filter(item => item.value == (FilterValue));
        return filterObject[0].label;
      } else {
        return "N/A";
      }
    }
  }
}
