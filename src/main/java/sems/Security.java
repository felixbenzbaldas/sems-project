package sems;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Security {

    public String createSecurityHash(String toHash) {
        try {
            return createSecurityHash_impl(toHash);
        } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private String createSecurityHash_impl(String toHash) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-512");
        String salt = "sfsf4244511g35kdk566fmfk6";
        Charset charset = StandardCharsets.UTF_8;
        messageDigest.update(salt.getBytes(charset));
        byte[] bytes = messageDigest.digest(toHash.getBytes(charset));
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < bytes.length; i++) {
            stringBuilder.append(getHexadecimalWithLeadingZero(bytes[i]));
        }
        return stringBuilder.toString();
    }

    private static String getHexadecimalWithLeadingZero(byte eightBits) {
        int integer = (eightBits & 0xff) + 0x100;
        return Integer.toString(integer, 16)
                .substring(1);
    }

}
