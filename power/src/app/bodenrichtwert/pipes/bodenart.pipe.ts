import { Pipe, PipeTransform } from '@angular/core';

const bodTypes = [
    { key: 'S', value: $localize`Sand`, slash: $localize`Sand`, comma: $localize`Sand`, plus: $localize`Sand` },
    { key: 'sL', value: $localize`Sandiger Lehm`, slash: $localize`sandigem Lehm`, comma: $localize`sandiger Lehm`, plus: $localize`sandigem Lehm` },
    { key: 'Sl', value: $localize`Anlehmiger Sand`, slash: $localize`anlehmigem Sand`, comma: $localize`anlehmiger Sand`, plus: $localize`anlehmigem Sand` },
    { key: 'St', value: $localize`Steine und Blöcke`, slash: $localize`Steinen und Blöcken`, comma: $localize`Steine und Blöcke`, plus: $localize`Steinen und Blöcken` },
    { key: 'lS', value: $localize`Lehmiger Sand`, slash: $localize`lehmigem Sand`, comma: $localize`lehmiger Sand`, plus: $localize`lehmigem Sand` },
    { key: 'lSg', value: $localize`Lehmiger Sand mit starkem Steingehalt`, slash: $localize`lemigem Sand mit starkem Steingehalt`, comma: $localize`lehmiger Sand mit starkem Steingehalt`, plus: $localize`lehmigem Sand mit starkem Steingehalt` },
    { key: 'L', value: $localize`Lehm`, slash: $localize`Lehm`, comma: $localize`Lehm`, plus: $localize`Lehm` },
    { key: 'Lg', value: $localize`Lehm mit starkem Steingehalt`, slash: $localize`Lehm mit starkem Steingehalt`, comma: $localize`Lehm mit starkem Steingehalt`, plus: $localize`Lehm mit starkem Steingehalt` },
    { key: 'LT', value: $localize`Schwerer Lehm`, slash: $localize`schwerem Lehm`, comma: $localize`schwerer Lehm`, plus: $localize`schwerem Lehm` },
    { key: 'T', value: $localize`Ton`, slash: $localize`Ton`, comma: $localize`Ton`, plus: $localize`Ton` },
    { key: 'Fe', value: $localize`Felsen`, slash: $localize`Felsen`, comma: $localize`Felsen`, plus: $localize`Felsen` },
    { key: 'Mo', value: $localize`Moor`, slash: $localize`Moor`, comma: $localize`Moor`, plus: $localize`Moor` }
];

@Pipe({
    name: 'bodenart'
})
export class BodenartPipe implements PipeTransform {

    public readonly regex: RegExp[] = [
        // 3 chars
        /^([a-z]{1})([A-Z]{2})/, // aBC , z.B. sLT
        /^([A-Z]{1})([A-Z]{1}[a-z]{1})/, // ABc , z.B. SMo
        /^([A-Z]{1}[a-z]{1})([A-Z]{1})/, // AbC , z.B. MoS
        // 4 chars
        /^([A-Z]{1}[a-z]{1})([a-z]{1}[A-Z]{1})/, // AbcD , z.B. MolS
        /^([A-Z]{1}[a-z]{1})([A-Z]{1}[a-z]{1})/, // AbCd , z.B. AbCd
        /^([a-z]{1}[A-Z]{1})([A-Z]{1}[a-z]{1})/ // aBCd , z.B. lSMo
        // more expressions ...
    ];

    /** @inheritdoc */
    public transform(value: string): string {

        let res = '';
        let types: string[] = [];

        if (this.bodTypeExists(value)) {
            const tmp = this.getBodType(value)?.value;
            if (tmp) {
                res = tmp;
            }
        } else if (value.includes(',')) {
            types = value.split(',');
            res = this.buildDisplayValue(types, 'und');
        } else if (value.includes('/')) {
            types = value.split('/');
            res = this.buildDisplayValue(types, 'auf');
        } else if (value.includes('+')) {
            types = value.split('+');
            res = this.buildDisplayValue(types, 'mit');
        } else {
            types = this.matchRegExp(value);
            if (types) {
                res = this.buildDisplayValue(types, ',');
            } else {
                res = ''; // no match
            }
        }
        return res;
    }

    /**
     * Checks if a bodenart exists for a given key
     * @param value key einer Bodenart
     * @returns returns true/false if bodenart exists
     */
    private bodTypeExists(value: string): boolean {
        return bodTypes.some(b => b.key === value);
    }

    /**
     * Checks the bodenart for a given key
     * @param value key einer Bodenart
     * @returns Returns the bodenart for a given key
     */
    private getBodType(value: string): typeof bodTypes[0] | undefined {
        return bodTypes.find(b => b.key === value);
    }

    /**
     * Builds the string based on the keys of different bodenarten and
     * concatenates them to an value for the display
     * @param types keys of given bodenarten
     * @param operator defines how to combine multiple bodenarten
     * @returns returns string of concatenated bodenarten
     */
    private buildDisplayValue(types: string[], operator: string): string {
        let displayValue = '';
        let trimSpaces = 2; // default
        let falseExp = false;

        if (operator.length === 1) {
            trimSpaces = 1;
        }

        types.forEach((t: string, i: number) => {
            const bod = this.getBodType(t);
            if (bod && !falseExp) {
                if (i === 0 && operator.length > 1) {
                    displayValue += bod.value + ' ' + operator + ' ';
                } else if (i === 0 && operator.length === 1) {
                    displayValue += bod.value + operator + ' ';
                } else {
                    displayValue += this.getValueByOperator(bod, operator);
                }
            } else {
                falseExp = true;
            }
        });

        if (falseExp) {
            displayValue = '';
        } else {
            displayValue = displayValue.slice(0, displayValue.length - (trimSpaces + operator.length));
        }

        return displayValue;
    }

    /**
     * Returns the correct valueString of a bodType for a specific operator
     * @param bodType bodType contains the bodenart with all values
     * @param operator defines how to combine multiple bodenarten
     * @returns Returns the correct valueString of a bodType for a specific operator
     */
    private getValueByOperator(bodType: typeof bodTypes[0], operator: string): string {
        let value = '';
        switch (operator) {
            case 'und': {
                value += bodType.comma + ' ' + operator + ' ';
                break;
            }
            case 'auf': {
                value += bodType.slash + ' ' + operator + ' ';
                break;
            }
            case 'mit': {
                value += bodType.plus + ' ' + operator + ' ';
                break;
            }
            case ',': {
                value += bodType.value + operator + ' ';
                break;
            }
        }
        return value;
    }

    /**
     * Checks a given string based on regular expressions for
     * different bodenarten combinations
     * @param value string with multiple bodenarten keys
     * @returns return the types of the different bodenarten
     */
    private matchRegExp(value: string): string[] {
        let types: string[] = [];

        this.regex.forEach((r: RegExp) => {
            if (r.test(value)) {
                const groups = r.exec(value);
                if (groups) {
                    types = groups.slice(1, groups.length);
                }
            }
        });
        return types;
    }
}
