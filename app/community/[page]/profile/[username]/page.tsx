import React from 'react';

export default function CommunityProfilePage({ params }: { params: { username: string } }) {
  return (
    <div>
      <h1>Topluluk Profil Sayfası</h1>
      <p>Kullanıcı Adı: {params.username}</p>
      <p>Bu sayfada community profil içeriği yer alacak</p>
    </div>
  );
}