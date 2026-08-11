package kr.go.support.subsidy.common.auth;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Component;

@Converter
@Component
public class AesBytesConverter implements AttributeConverter<String, String> {

    private final TextEncryptor textEncryptor;

    public AesBytesConverter(@Value("${app.encrypt.secret}") String secretKey, @Value("${app.encrypt.salt}") String salt) {

        this.textEncryptor = Encryptors.delux(secretKey, salt);
    }


    @Override
    public String convertToDatabaseColumn(String entityAttribute){
        if(entityAttribute == null) return null;
        return textEncryptor.encrypt(entityAttribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData){
        if(dbData == null) return null;
        return textEncryptor.decrypt(dbData);
    }
}
