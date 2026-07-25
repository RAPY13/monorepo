import { Converter } from "../types/open-next";
type DummyEventOrResult = {
    type: "dummy";
    original: any;
};
declare const converter: Converter<DummyEventOrResult, DummyEventOrResult>;
export default converter;
