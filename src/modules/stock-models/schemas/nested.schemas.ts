import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class ModelSpecification {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    value: string;

    @Prop({ required: false })
    unit: string;
}

export const ModelSpecificationSchema = SchemaFactory.createForClass(ModelSpecification);