import * as _ from 'lodash';


declare global {
    /**
     * convert collection/Array to comma seprated string with single attribute
     */
    interface Array<T> {
        convertArrayToJoinText(attribute: string): String;
    }

}


Array.prototype.convertArrayToJoinText = function (attribute: string): string {
    return _.map(this, item => item[attribute]).join(", ");
}

export { };